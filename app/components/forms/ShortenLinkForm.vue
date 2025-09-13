<template>
  <div>
    <form
      class="space-y-2"
      @submit.prevent="onSubmit"
      @reset.prevent="onReset"
    >
      <FormField
        v-slot="{ componentField }"
        name="url"
      >
        <fieldset
          class="flex items-center rounded-lg border border-2 border-input focus-within:ring-2 focus-within:ring-ring transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md h-13"
        >
          <FormItem class="flex-1">
            <FormControl>
              <Input
                type="text"
                v-bind="componentField"
                :disabled="form.isSubmitting.value"
                placeholder="Enter your long URL here"
                class="border-0 rounded-none focus-visible:ring-0 bg-transparent min-h-full"
              />
            </FormControl>
          </FormItem>

          <Slot
            class="rounded-none h-full border-0 shadow-none cursor-pointer text-xl"
          >
            <Button
              v-if="!shortenedUrl"
              :pending
              type="submit"
            >
              <template #icon>
                <ArrowRightIcon />
              </template>
            </Button>

            <Button
              v-else
              type="reset"
              variant="ghost"
            >
              <template #icon>
                <TrashIcon />
              </template>
            </Button>
          </Slot>
        </fieldset>

        <FormMessage />
      </FormField>
    </form>

    <!-- Result Display -->
    <SizeTransition
      concurrent
      singular
    >
      <div v-if="shortenedUrl">
        <ShortenedLinkBox
          :url="shortenedUrl"
          class="mt-6"
        />
      </div>
    </SizeTransition>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, TrashIcon } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { Slot } from 'reka-ui';

import { CreateShortenedUrlDtoSchema } from '#shared/dtos';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import ShortenedLinkBox from '@/components/ShortenedLinkBox.vue';
import SizeTransition from '@/components/ui/SizeTransition.vue';
import { useToast } from '@/components/ui/toast';

const $toast = useToast();

const formSchema = toTypedSchema(
  CreateShortenedUrlDtoSchema,
);

const form = useForm({
  name: 'shorten-link-form',
  validationSchema: formSchema,
  initialValues: {
    url: '',
  },
});

const pending = computed(() => form.isSubmitting.value);
const shortenedUrl = ref('');

const onReset = () => {
  shortenedUrl.value = '';

  form.resetForm();
};

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const response = await $fetch('/api/shorten', {
      method: 'POST',
      body: { url: values.url },
    });

    shortenedUrl.value = response.shortUrl;
  } catch (error: any) {
    $toast.toast({
      title: 'Failed to shorten link',
      description:
        error?.message ||
        'Please try again with a valid URL.',
    });
  }
});
</script>
