import React from 'react';
import { Card, List, Tag, Typography, Space } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import type { Category } from '../../types/blog';

const { Title, Text } = Typography;

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: number;
  onCategoryClick?: (categoryId: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
}) => {
  return (
    <Card
      title={
        <Space>
          <FolderOutlined style={{ color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>文章分类</Title>
        </Space>
      }
      bodyStyle={{ padding: '12px 24px' }}
    >
      <List
        dataSource={categories}
        split={false}
        renderItem={category => (
          <List.Item 
            style={{ 
              cursor: 'pointer',
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0',
              transition: 'all 0.3s',
              backgroundColor: category.id === selectedCategory ? '#e6f7ff' : 'transparent',
              borderRadius: '4px',
              margin: '4px 0'
            }}
            onClick={() => onCategoryClick?.(category.id)}
          >
            <Space style={{ width: '100%', padding: '0 12px' }}>
              <Tag
                color={category.id === selectedCategory ? '#1890ff' : undefined}
                style={{ 
                  margin: 0,
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}
              >
                {category.name}
              </Tag>
              <Text type="secondary" style={{ marginLeft: 'auto' }}>
                {category.postCount || 0} 篇
              </Text>
            </Space>
          </List.Item>
        )}
      />
      {categories.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '24px 0',
          color: '#999' 
        }}>
          暂无分类
        </div>
      )}
    </Card>
  );
};

export default CategoryList; 