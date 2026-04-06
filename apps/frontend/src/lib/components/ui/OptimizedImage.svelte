<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { getCloudinaryCloudName, buildCloudinaryUrl, buildSrcset, getSizesAttribute } from '$lib/utils/cloudinary';

  let { 
    src, 
    alt, 
    cloudinaryId, 
    priority = false, 
    class: className = '',
    ...rest 
  }: {
    src: string;
    alt: string;
    cloudinaryId?: string;
    priority?: boolean;
    class?: string;
  } = $props();

  const cloudName = getCloudinaryCloudName();
  const hasCloudinaryConfig = cloudName !== null;
  const canUseCloudinary = $derived(hasCloudinaryConfig && !!cloudinaryId && cloudinaryId.length > 0);

  const imageSrc = $derived(() => {
    if (!canUseCloudinary || !cloudinaryId) {
      return src;
    }
    return buildCloudinaryUrl(cloudinaryId, { width: 1280 });
  });

  const imageSrcset = $derived(() => {
    if (!canUseCloudinary || !cloudinaryId) {
      return undefined;
    }
    return buildSrcset(cloudinaryId);
  });

  const sizes = $derived(() => {
    if (!canUseCloudinary) {
      return undefined;
    }
    return getSizesAttribute();
  });

  const loadingAttr = $derived(priority ? 'eager' : 'lazy');
  const fetchPriorityAttr = $derived(priority ? 'high' : undefined);
</script>

<img
  src={imageSrc()}
  {alt}
  class={cn('object-cover', className)}
  loading={loadingAttr}
  fetchpriority={fetchPriorityAttr}
  srcset={imageSrcset()}
  sizes={sizes()}
/>