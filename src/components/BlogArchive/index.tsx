import React from 'react';
import { Card, Timeline, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../types/blog';

const { Title, Text } = Typography;

interface BlogArchiveProps {
  posts: BlogPost[];
}

interface ArchiveItem {
  year: number;
  month: number;
  posts: BlogPost[];
}

const BlogArchive: React.FC<BlogArchiveProps> = ({ posts }) => {
  // 按年月对文章进行分组
  const groupedPosts = posts.reduce<ArchiveItem[]>((acc, post) => {
    const date = new Date(post.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    const existingGroup = acc.find(item => item.year === year && item.month === month);
    if (existingGroup) {
      existingGroup.posts.push(post);
    } else {
      acc.push({ year, month, posts: [post] });
    }

    return acc;
  }, []);

  // 按时间倒序排序
  groupedPosts.sort((a, b) => {
    const dateA = new Date(a.year, a.month);
    const dateB = new Date(b.year, b.month);
    return dateB.getTime() - dateA.getTime();
  });

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  return (
    <Card title={<Title level={4}>文章归档</Title>}>
      <Timeline
        items={groupedPosts.map(group => ({
          children: (
            <div key={`${group.year}-${group.month}`}>
              <Title level={5}>{`${group.year}年${monthNames[group.month]}`}</Title>
              {group.posts.map(post => (
                <div key={post.id} style={{ marginBottom: 8 }}>
                  <Link to={`/blog/${post.id}`}>
                    <Text>{post.title}</Text>
                  </Link>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({new Date(post.createdAt).toLocaleDateString()})
                  </Text>
                </div>
              ))}
            </div>
          )
        }))}
      />
    </Card>
  );
};

export default BlogArchive; 