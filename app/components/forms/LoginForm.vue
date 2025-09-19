<template>
  <div
    :class="
      cn(
        'rounded-[2rem] border border-primary/30 w-full max-w-2xl py-20 px-16 relative overflow-hidden shadow-lg shadow-primary/20',
        props.class ?? '',
      )
    "
  >
    <Logo
      class="w-[80%] h-auto text-muted-foreground/5 absolute -right-25 top-2"
    />

    <SizeTransition
      concurrent
      :fade-config="{ duration: 250 }"
      :size-config="{ duration: 250 }"
    >
      <div
        :key="activeEmail ? 'success' : 'login'"
        class="relative"
      >
        <!-- Success State -->
        <div
          v-if="activeEmail"
          class="text-center space-y-6"
        >
          <div
            class="mx-auto w-20 h-20 bg-gradient-to-br from-primart/15 via-primart/10 to-primary/5 rounded-2xl flex items-center justify-center shadow-lg border border-green-500/10"
          >
            <CheckCircle class="size-10 text-primary" />
          </div>

          <h2
            class="text-5xl font-bold text-foreground tracking-tight"
          >
            Check Your Email
          </h2>
          <p
            class="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed"
          >
            We've sent a secure sign-in link to
            <span class="font-semibold text-foreground">{{
              activeEmail
            }}</span>
          </p>
          <div class="pt-4">
            <Button
              variant="outline"
              size="lg"
              class="px-8"
              @click="onReset"
            >
              Send Another Link
            </Button>
          </div>
        </div>

        <!-- Login Form -->
        <div v-else>
          <!-- Header -->
          <div class="text-center space-y-6">
            <div
              class="mx-auto w-20 h-20 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 rounded-2xl flex items-center justify-center shadow-lg border border-primary/10"
            >
              <ArrowRight
                class="w-10 h-10 text-primary rotate-45"
              />
            </div>
            <h2
              class="text-5xl font-bold text-foreground tracking-tight"
            >
              Login
            </h2>
            <p
              class="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed"
            >
              Enter your email to receive a secure sign-in
              link
            </p>
          </div>

          <!-- Form -->
          <form
            class="relative"
            @submit.prevent="onSubmit"
          >
            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <fieldset class="space-y-4 mt-5">
                <FormItem class="relative group">
                  <FormControl>
                    <Input
                      id="email"
                      v-bind="componentField"
                      type="text"
                      :disabled="pending"
                      class="w-full"
                      placeholder="Enter your email address"
                      autocomplete="email"
                    />
                  </FormControl>
                </FormItem>
              </fieldset>

              <FormMessage class="pt-3" />
            </FormField>

            <Button
              size="lg"
              class="w-full h-16 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 mt-10"
              type="submit"
              :pending
              icon-position="right"
            >
              <template #icon>
                <ArrowRight class="w-6 h-6" />
              </template>

              Send Magic Link
            </Button>
          </form>

          <div class="text-center space-y-4 mt-8">
            <p
              class="text-lg text-muted-foreground/70 leading-relaxed"
            >
              We'll send you a secure, passwordless link to
              sign in to your account
            </p>
            <div
              class="flex items-center justify-center gap-6 text-sm text-muted-foreground/50"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 bg-primary rounded-full"
                ></div>
                <span>Secure & Private</span>
              </div>

              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 bg-primary rounded-full"
                ></div>
                <span>No Password Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SizeTransition>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, CheckCircle } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { ref } from '#imports';
import type { HTMLAttributes } from 'vue';

import { CreateMagicLinkDtoSchema } from '#shared/dtos/magic-link';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import SizeTransition from '@/components/ui/SizeTransition';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import Logo from '@/components/Logo.vue';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/utils/cn';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const $toast = useToast();

const formSchema = toTypedSchema(CreateMagicLinkDtoSchema);
const form = useForm({
  name: 'magic-link-form',
  validationSchema: formSchema,
  initialValues: {
    email: '',
  },
});

const pending = computed(() => form.isSubmitting.value);
const activeEmail = ref('');

const onSubmit = form.handleSubmit(async ({ email }) => {
  try {
    await $fetch('/api/auth/magic-link', {
      method: 'POST',
      body: {
        email,
      },
    });

    activeEmail.value = email;
  } catch (error: any) {
    $toast.toast({
      title: 'Failed to send magic link',
      description:
        error?.data?.message ||
        'Please try again with a valid email.',
    });
  }
});

const onReset = () => {
  activeEmail.value = '';
  form.resetForm();
};
</script>
