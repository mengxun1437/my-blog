/* eslint-disable no-template-curly-in-string */
/* eslint-disable jsx-a11y/anchor-is-valid */
import "./index.css";
import {
  Layout,
  Menu,
  Breadcrumb,
  Tooltip,
  Row,
  Col,
  Button,
  Badge,
  Image,
  PaginationProps,
  Input,
  Space,
  TableColumnsType,
  message,
  Tag,
  Form,
} from "antd";
import Highlighter from "react-highlight-words";
import { FileMarkdownFilled, SearchOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CustomTable,
  CustomDrawer,
  CustomDrawerProps,
} from "../../../components";
import { getBlogs, saveBlogs } from "../../../services/blog.service";
import { DateFormat } from "../../../utils/utils";
import { getTags } from "../../../services/tag.service";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface NavItem {
  icon?: React.ReactNode;
  key: string;
  desc: string;
  children?: NavItem[];
}

export interface BlogData {
  id: number;
  blogId: string;
  title: string;
  cover: string;
  tags: string;
  status: string;
  created: string;
  updated: string;
}

export enum BlogStatus {
  Draft = "draft",
  Published = "published",
  Deleted = "deleted",
}

const BlogStatusMap: any = {
  [BlogStatus.Draft]: "草稿",
  [BlogStatus.Published]: "已发布",
  [BlogStatus.Deleted]: "已删除",
};

const navMap: NavItem[] = [
  {
    icon: <FileMarkdownFilled />,
    key: "blog",
    desc: "博文",
    children: [
      {
        key: "blogManage",
        desc: "博文管理",
      },
      {
        key: "addBlog",
        desc: "编辑博文",
      },
      {
        key: "tagManage",
        desc: "标签管理",
      },
      {
        key: "deletedBlog",
        desc: "回收站",
      },
    ],
  },
];

const blogPagination: PaginationProps = {
  defaultPageSize: 7,
  showSizeChanger: false,
};

const blogDataHandle = (blog: BlogData) => {
  return {
    ...blog,
    created: DateFormat(blog.created),
    updated: DateFormat(blog.updated),
  };
};

export function AdminIndex() {
  const [needFresh, setNeedFresh] = useState<boolean>(true);
  const [breadTip, setBreadTip] = useState(["博文", "博文管理"]);
  const [blogList, setBlogList] = useState<any[]>([]);
  const [tagList, setTagList] = useState<any[]>([]);
  const [searchState, setSearchState] = useState<any>({
    searchText: "",
    searchedColumn: "",
  });
  const searchInputRef = useRef<any>("");
  const [drawerConfig, setDrawerConfig] = useState<CustomDrawerProps>();
  const editBlogInfoRef = useRef<any>();

  const getEditBlogModalConfig = (record: any): CustomDrawerProps => ({
    title: "编辑博文信息",
    visible: true,
    size: "default",
    onClose: () => {
      editBlogInfoRef.current = {};
    },
    children: (
      <Form key={`blog-edit-${record.blogId}`}>
        <Form.Item name={["blog", "title"]} label="标题">
          <Input
            defaultValue={record.title || ""}
            onChange={(e) => {
              editBlogInfoRef.current.title = e.target.value;
            }}
          />
        </Form.Item>
        <Form.Item name={["blog", "cover"]} label="封面">
          <Input
            defaultValue={record.cover || ""}
            value={record.cover}
            onChange={(e) => {
              editBlogInfoRef.current.cover = e.target.value;
            }}
          />
        </Form.Item>
        <Form.Item name={["blog", "tags"]} label="标签">
          <Input
            defaultValue={record.tags || ""}
            onChange={(e) => {
              editBlogInfoRef.current.tags = e.target.value;
            }}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          onClick={async () => {
            console.log(editBlogInfoRef.current);
            if (
              !(editBlogInfoRef.current.title && editBlogInfoRef.current.cover)
            ) {
              message.warning("标题和封面不能为空");
              return;
            }
            const save = await saveBlogs(editBlogInfoRef.current);
            if (save.code === 0) {
              message.success("博文信息修改成功");
              setDrawerConfig({ ...drawerConfig, visible: false });
              setNeedFresh(!needFresh);
            } else {
              message.error("博文信息修改失败");
            }
          }}
        >
          修改
        </Button>
      </Form>
    ),
  });

  const changeBlogStatus = async (
    blogId: string,
    status: BlogStatus
  ): Promise<boolean> => {
    try {
      const res = await saveBlogs({
        blogId,
        status,
      });
      if (res.code === 0) {
        setNeedFresh(!needFresh);
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInputRef.current = node;
          }}
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            高亮
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select(), 100);
      }
    },
    render: (text: any) =>
      searchState.searchedColumn === dataIndex ? (
        <Tooltip placement="topLeft" title={text}>
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchState.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        </Tooltip>
      ) : (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
  });

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchState({ searchText: "" });
  };

  const blogTableColumns: TableColumnsType = [
    {
      title: "id",
      key: "blogId",
      dataIndex: "blogId",
      fixed: "left",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("blogId"),
    },
    {
      title: "标题",
      key: "title",
      dataIndex: "title",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("title"),
    },
    {
      title: "封面",
      key: "cover",
      dataIndex: "cover",
      ellipsis: {
        showTitle: false,
      },
      render: (cover: string) => (
        <Tooltip
          placement="topLeft"
          title={cover}
          overlay={<Image src={cover} width={50} />}
          style={{ width: 100 }}
        >
          {cover}
        </Tooltip>
      ),
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      ellipsis: {
        showTitle: false,
      },
      render: (tags) => (
        <Tooltip
          placement="topLeft"
          overlay={
            <>
              {tags.split("@").map((tag: any) => {
                const target = tagList.find(
                  (item) => item.tagId === Number(tag)
                );
                return target ? (
                  <Tag color="blue" key={tag}>
                    {target.name}
                  </Tag>
                ) : null;
              })}
            </>
          }
          style={{ width: 100 }}
        >
          {tags.split("@")[0].length ? (
            <div>
              {tags.split("@").map((tag: any) => {
                const target = tagList.find(
                  (item) => item.tagId === Number(tag)
                );
                return target ? (
                  <Tag color="blue" key={tag}>
                    {target.name}
                  </Tag>
                ) : null;
              })}
            </div>
          ) : null}
        </Tooltip>
      ),
    },
    {
      title: "状态",
      key: "status",
      dataIndex: "status",
      filters: Object.keys(BlogStatusMap).map((item) => ({
        text: BlogStatusMap[item],
        value: item,
      })),
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
      render: (status: BlogStatus, record: any) => (
        <Row gutter={4}>
          <Col>
            <Badge
              status={
                status === BlogStatus.Draft
                  ? "warning"
                  : status === BlogStatus.Published
                  ? "success"
                  : "error"
              }
            />
          </Col>
          {(status === BlogStatus.Draft || status === BlogStatus.Deleted) && (
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={async () => {
                  if (
                    await changeBlogStatus(record.blogId, BlogStatus.Published)
                  ) {
                    message.success("博文发布成功");
                  } else {
                    message.error("博文发布失败");
                  }
                }}
              >
                发布
              </Button>
            </Col>
          )}
          {(status === BlogStatus.Draft || status === BlogStatus.Published) && (
            <Col>
              <Button
                size="small"
                danger
                type="primary"
                onClick={async () => {
                  if (
                    await changeBlogStatus(record.blogId, BlogStatus.Deleted)
                  ) {
                    message.success("博文删除成功");
                  } else {
                    message.error("博文删除失败");
                  }
                }}
              >
                删除
              </Button>
            </Col>
          )}
          {(status === BlogStatus.Published ||
            status === BlogStatus.Deleted) && (
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={async () => {
                  if (await changeBlogStatus(record.blogId, BlogStatus.Draft)) {
                    message.success("博文已转为草稿");
                  } else {
                    message.error("博文转为草稿失败");
                  }
                }}
              >
                转为草稿
              </Button>
            </Col>
          )}
        </Row>
      ),
    },
    {
      title: "创建时间",
      key: "created",
      dataIndex: "created",
      sorter: (a: any, b: any) =>
        new Date(a.created).getTime() - new Date(b.created).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "更新时间",
      key: "updated",
      dataIndex: "updated",
      sorter: (a: any, b: any) =>
        new Date(a.updated).getTime() - new Date(b.updated).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "操作",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (value: any, record: any) => (
        <>
          <a
            onClick={() => {
              editBlogInfoRef.current = {
                blogId: record.blogId,
                title: record.title,
                cover: record.cover,
                tags: record.tags,
              };
              setDrawerConfig({ ...getEditBlogModalConfig(record) });
            }}
          >
            编辑
          </a>
          &nbsp;
          <a>内容</a>
          &nbsp;
          <a>线上</a>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchTagList = async () => {
      const tags = await getTags();
      console.log(tags);
      if (tags.code === 0) {
        setTagList(tags.data.list);
      }
    };
    fetchTagList();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await getBlogs();
      if (blogs.code === 0) {
        setBlogList(
          blogs.data.list.map((item: any, index: number) => ({
            ...blogDataHandle(item),
            key: `blog-data-${index}`,
          }))
        );
      }
    };
    fetchData();
  }, [needFresh]);

  return (
    <React.Fragment>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible style={{ userSelect: "none" }}>
          <div className="logo" />

          <Menu theme="dark" defaultSelectedKeys={["blogManage"]} mode="inline">
            {navMap.map((nav) =>
              nav.children && nav.children.length ? (
                <SubMenu key={nav.key} icon={nav.icon} title={nav.desc}>
                  {nav.children.map((child) => (
                    <Menu.Item key={child.key}>{child.desc}</Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={nav.key} icon={nav.icon}>
                  {nav.desc}
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{ padding: 0, textAlign: "center", userSelect: "none" }}
          >
            欢迎来到梦寻博客管理后台
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0", userSelect: "none" }}>
              {breadTip.map((bread, index) => (
                <Breadcrumb.Item key={`bread-${index}`}>
                  {bread}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 540 }}
            >
              <CustomTable
                columns={blogTableColumns}
                dataSource={blogList}
                pagination={blogPagination}
                style={{ userSelect: "none" }}
                extraKeys={{ scroll: { x: 1300 } }}
              />
            </div>
          </Content>
          <Footer style={{ textAlign: "center", userSelect: "none" }}>
            Mengxun ©2021 Created by Mengxun
          </Footer>
        </Layout>
      </Layout>
      <CustomDrawer {...drawerConfig} />
    </React.Fragment>
  );
}
