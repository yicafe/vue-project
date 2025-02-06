<template>
  <div>
    <Auth />
    <PostForm />
  </div>
</template>

<script>
import Auth from '../components/Auth.vue';
import PostForm from '../components/PostForm.vue';

export default {
  components: { Auth, PostForm },
};
</script>
