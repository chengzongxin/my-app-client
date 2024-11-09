// 导出所有博客相关组件
export { default as BlogList } from './List';  // 注意这里是从 List.tsx 导入
export { default as BlogDetail } from './Detail';
export { default as BlogEdit } from './Edit';

// 为了向后兼容，也导出默认的 BlogList 
export { default } from './List'; 