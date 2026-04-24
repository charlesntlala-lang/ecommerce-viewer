type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    cache: 'no-store', // always fresh
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <a
          key={product.id}
          href={`/products/${product.id}`}
          className="border p-4 rounded-lg hover:shadow-lg transition"
        >
          <img src={product.image} alt={product.title} className="h-40 mx-auto" />
          <h2 className="mt-4 font-semibold">{product.title}</h2>
          <p className="text-blue-600 font-bold">${product.price}</p>
        </a>
      ))}
    </main>
  );
}