import React, { useState } from 'react';
import { Card, List, Button, Input, Modal, Form, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Category } from '../../types/blog';

interface CategoryManagerProps {
  categories: Category[];
  onAdd?: (name: string) => Promise<void>;
  onEdit?: (id: number, name: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCategory) {
        await onEdit?.(editingCategory.id, values.name);
      } else {
        await onAdd?.(values.name);
      }

      message.success(`${editingCategory ? '编辑' : '添加'}成功`);
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.name });
    setModalVisible(true);
  };

  return (
    <Card
      title="分类管理"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          添加分类
        </Button>
      }
    >
      <List
        dataSource={categories}
        renderItem={item => (
          <List.Item
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(item)}
              >
                编辑
              </Button>,
              <Popconfirm
                title="确定要删除这个分类吗？"
                onConfirm={() => onDelete?.(item.id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`${item.postCount || 0} 篇文章`}
            />
          </List.Item>
        )}
      />

      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryManager; 