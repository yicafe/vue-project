<template>
  <div class="relative overflow-hidden ">
    <div class="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="sr-only">Products</h2>

      <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <a v-for="product in products" :key="product.id" :href="product.href" class="group">
          <img :src="product.imageSrc" :alt="product.imageAlt" class="object-cover w-full bg-gray-200 rounded-lg aspect-square group-hover:opacity-75 xl:aspect-7/8" />
          <h3 class="mt-4 text-sm text-gray-700">{{ product.name }}</h3>
          <p class="mt-1 text-lg font-medium text-gray-900">{{ product.price }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 5,
    name: 'Focus Card Tray',
    href: '#',
    price: '$66',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-05.jpg',
    imageAlt: '#',
  },
  {
    id: 6,
    name: 'Focus Multi-Pack',
    href: '#',
    price: '$',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-06.jpg',
    imageAlt: '#',
  },
  {
    id: 7,
    name: 'Brass Scissors',
    href: '#',
    price: '$',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-07.jpg',
    imageAlt: '#',
  },
  {
    id: 8,
    name: 'Focus Carry Pouch',
    href: '#',
    price: '$',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-08.jpg',
    imageAlt: '#',
  },
  // More products...
]


</script>