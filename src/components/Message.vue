<template>
    <transition name="slide-fade">
        <div v-if="visible" :class="['message-container', type]">
            <div class="message-content">
                {{ message }}
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'info' // info, success, warning, error
    },
    duration: {
        type: Number,
        default: 3000
    }
})

const visible = ref(false)

onMounted(() => {
    visible.value = true
    if (props.duration > 0) {
        setTimeout(() => {
            visible.value = false
        }, props.duration)
    }
})
</script>

<style scoped>
.message-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 20px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 14px;
    z-index: 10000;
    min-width: 120px;
    max-height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

}

.success {
    /* background: rgba(82, 196, 26, 0.8); */
    background: rgba(0, 0, 0, 0.5);
}

.warning {
    /* background: rgba(250, 173, 20, 0.8); */
    background: rgba(0, 0, 0, 0.5);
}

.error {
    /* background: rgba(0, 0, 0, 0.5); */
    background: rgba(0, 0, 0, 0.5);
}

.info {
    /* background: rgba(0, 0, 0, 0.7); */
    background: rgba(0, 0, 0, 0.5);
}

/* 动画效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translate(-50%, calc(-50% - 20px));
    opacity: 0;
}
</style> 