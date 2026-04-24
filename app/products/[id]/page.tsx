type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);

  if (!res.ok) {
    throw new Error('Product not found');
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img src={product.image} className="h-64 mx-auto" />

      <h1 className="text-2xl font-bold mt-6">{product.title}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl text-blue-600 mt-4">${product.price}</p>
    </div>
  );
}