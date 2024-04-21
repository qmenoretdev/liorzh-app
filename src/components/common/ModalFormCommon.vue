<script lang="ts">
import type { ApiError } from "@/models/ApiError";
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["close", "submit"],
  props: {
    visible: {
      default: false,
    },
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
  data() {
    return {
      visibleData: false,
    };
  },
  watch: {
    visible(newVisibility) {
      this.visibleData = newVisibility;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
});
</script>
