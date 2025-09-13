<template>
  <Container class="flex items-start justify-center mt-30">
    <div
      class="bg-muted/40 shadow-4xl shadow-primary/20 rounded-3xl shadow-[0_20px_50px_-5px] w-[60%] py-16 px-30 relative overflow-hidden"
    >
      <Logo
        class="w-[60%] h-auto text-muted-foreground/10 absolute -right-10 top-10"
      />

      <h2
        class="text-4xl font-bold text-center mb-8 relative"
      >
        Login
      </h2>

      <form
        class="space-y-8 relative"
        @submit.prevent="onSubmit"
      >
        <fieldset>
          <label
            for="email"
            class="block text-md ml-1 font-medium text-muted-foreground/60 mb-2"
          >
            Email
          </label>

          <Input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="pending"
            class="w-full text-lg"
            placeholder="Enter your email address"
            autocomplete="email"
          />
        </fieldset>

        <Button
          size="lg"
          class="w-full h-14 text-lg"
          type="submit"
          :pending
          icon-position="right"
        >
          <template #icon>
            <ArrowRight />
          </template>

          Send magic link
        </Button>
      </form>

      <p
        class="text-base text-muted-foreground/50 text-center mt-8"
      >
        We'll send you a secure link to sign in to your
        account.
      </p>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import { ref, useRouter, useAuth } from '#imports';

import type { CreateMagicLinkDto } from '#shared/dtos/magic-link';
import Container from '@/components/ui/Container.vue';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import Logo from '@/components/Logo.vue';

const $router = useRouter();

const { fetchUser } = useAuth();

definePageMeta({
  middleware: 'guest',
});

const form = ref<CreateMagicLinkDto>({
  email: '',
});
const pending = ref(false);

async function onSubmit() {
  try {
    pending.value = true;

    const { token } = await $fetch('/api/auth/magic-link', {
      method: 'POST',
      body: form.value,
    });

    if (token) {
      await $fetch('/api/auth/verify', {
        method: 'POST',
        body: {
          token,
        },
      });

      await fetchUser();

      $router.push('/');
    }
  } finally {
    pending.value = false;
  }
}
</script>
