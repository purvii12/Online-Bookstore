exports.handler = async () => {
  const books = [
    {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C Martin',
      category: 'Programming',
      price: 3799,
      description: 'Clean coding practices and principles.',
      image_url: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX377_BO1,204,203,200_.jpg',
      stock: 25
    },
    {
      id: 2,
      title: 'AWS Certified Solutions Architect',
      author: 'AWS Team',
      category: 'Cloud',
      price: 4499,
      description: 'Guide for AWS Solutions Architect certification.',
      image_url: 'https://images-na.ssl-images-amazon.com/images/I/41Z1QzC0Q-L._SX379_BO1,204,203,200_.jpg',
      stock: 15
    },
    {
      id: 3,
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      category: 'Programming',
      price: 3299,
      description: 'Pragmatic software development practices.',
      image_url: 'https://images-na.ssl-images-amazon.com/images/I/51A0OZ6pKGL._SX379_BO1,204,203,200_.jpg',
      stock: 18
    },
    {
      id: 4,
      title: 'Designing Data Intensive Applications',
      author: 'Martin Kleppmann',
      category: 'Architecture',
      price: 5599,
      description: 'Scalable and reliable data systems.',
      image_url: 'https://images-na.ssl-images-amazon.com/images/I/51e6p7pQG-L._SX379_BO1,204,203,200_.jpg',
      stock: 10
    }
  ];

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ books })
  };
};
