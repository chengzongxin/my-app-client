import React from 'react';
import { Card, List, Tag, Typography } from 'antd';
import type { Category } from '../../types/blog';

const { Title } = Typography;

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
    <Card title={<Title level={4}>文章分类</Title>}>
      <List
        dataSource={categories}
        renderItem={category => (
          <List.Item 
            style={{ cursor: 'pointer' }}
            onClick={() => onCategoryClick?.(category.id)}
          >
            <Tag
              color={category.id === selectedCategory ? 'blue' : undefined}
              style={{ margin: 0 }}
            >
              {category.name}
            </Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CategoryList; 