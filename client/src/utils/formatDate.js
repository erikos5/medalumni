const formatDate = date => {
  return new Date(date).toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default formatDate; 