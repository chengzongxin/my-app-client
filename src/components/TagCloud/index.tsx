import React from 'react';
import { Card, Tag, Typography } from 'antd';
import type { TagProps } from 'antd';

const { Title } = Typography;

interface TagWithCount {
  name: string;
  count: number;
}

interface TagCloudProps {
  tags: TagWithCount[];
  selectedTag?: string;
  onTagClick?: (tag: string) => void;
}

const TagCloud: React.FC<TagCloudProps> = ({ tags, selectedTag, onTagClick }) => {
  // 根据标签数量计算字体大小
  const getTagSize = (count: number): TagProps['style'] => {
    const minSize = 12;
    const maxSize = 24;
    const minCount = Math.min(...tags.map(t => t.count));
    const maxCount = Math.max(...tags.map(t => t.count));
    
    // 避免除以零
    const range = maxCount - minCount || 1;
    const size = minSize + ((count - minCount) / range) * (maxSize - minSize);

    return {
      fontSize: size,
      cursor: 'pointer',
      margin: '4px',
    };
  };

  return (
    <Card title={<Title level={4}>标签云</Title>}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map((tag) => (
          <Tag
            key={`tag-cloud-${tag.name}`}  // 添加唯一的 key
            style={getTagSize(tag.count)}
            color={tag.name === selectedTag ? 'blue' : undefined}
            onClick={() => onTagClick?.(tag.name)}
          >
            {`${tag.name} (${tag.count})`}  // 使用模板字符串
          </Tag>
        ))}
      </div>
    </Card>
  );
};

export default TagCloud; 