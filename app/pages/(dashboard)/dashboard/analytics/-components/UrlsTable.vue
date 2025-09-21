<template>
  <div
    class="bg-card border border-border rounded-lg overflow-hidden"
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Original URL</TableHead>
          <TableHead v-if="isPremium">Clicks</TableHead>
          <TableHead>Created</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="url in urls"
          :key="url.id"
          class="hover:bg-accent/50 transition-colors"
        >
          <TableCell>
            <code
              class="text-sm font-mono bg-muted px-2 py-1 rounded"
            >
              {{ url.code }}
            </code>
          </TableCell>

          <TableCell>
            <div class="max-w-xs truncate">
              <a
                :href="url.longUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-primary hover:underline truncate block"
              >
                {{ url.longUrl }}
              </a>
            </div>
          </TableCell>

          <TableCell v-if="isPremium">
            <span class="font-medium">{{
              spaceNumber(url.clicks || 0)
            }}</span>
          </TableCell>

          <TableCell>
            <NuxtTime
              :datetime="url.createdAt"
              class="text-sm text-muted-foreground"
            />
          </TableCell>

          <TableCell>
            <Button
              variant="outline"
              size="sm"
              class="ml-2"
              @click="onCopy(url.code)"
            >
              <CopyIcon class="size-3" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '#imports';
import { NuxtTime } from '#components';
import { CopyIcon } from 'lucide-vue-next';
import type { InternalApi } from 'nitropack/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createShortUrl } from '#shared/utils/create-short-url';
import Button from '@/components/ui/Button.vue';
import { useToast } from '@/components/ui/toast';
import { spaceNumber } from '#shared/utils/space-number';

const $toast = useToast();

const { isPremium } = useAuth();

defineProps<{
  urls: InternalApi['/api/analytics/urls']['default']['urls'];
}>();

async function onCopy(code: string) {
  try {
    await navigator.clipboard.writeText(
      createShortUrl(code),
    );
    $toast.toast({
      title: 'Copied to clipboard!',
      description: 'The shortened URL has been copied.',
    });
  } catch (error) {
    console.error(error);
    $toast.toast({
      title: 'Failed to copy',
      description: 'Please copy the URL manually.',
    });
  }
}
</script>
