<!--可复用的 Section 组件,每个部分（如“尊重他人”、“禁止不当内容”）通过 Section 组件渲染，结构清晰且易于维护。-->
<template>
    <div>
      <h3 class="mb-2 text-xl font-semibold text-gray-800">{{ title }}</h3>
      <div class="space-y-2 text-gray-700">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
    },
  };
  </script>