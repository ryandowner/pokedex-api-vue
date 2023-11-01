<template>
  <div>
    <input
        type="radio"
        :name="name"
        :id="id"
        :class="classes"
        :checked="isChecked"
        v-on:change="$emit('change', $event.target.checked)"
    >
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
export default {
    name: 'FormRadio',
    props: {
        id: String,
        name: String,
        classList: Array,
        checked: Boolean,
        label: String
    },
    computed: {
        classes () {
            return this.classList.join(' ');
        },
        isChecked () {
            return !!this.checked
        }
    }
}
</script>
