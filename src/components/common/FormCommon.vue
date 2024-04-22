<script lang="ts">
import type { ApiError } from "@/models/ApiError";
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["quit", "submit"],
  props: {
    header: {
      default: "Create",
    },
    apiErrors: {
      default: [] as ApiError[],
    },
    submitButtonLabel: {
      default: "Create",
    },
    loading: {
      default: false,
    },
  },
  methods: {
    quit() {
      this.$emit("quit");
    },
  },
});
</script>
