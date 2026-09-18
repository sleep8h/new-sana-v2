import { createVNode, render } from 'vue'
import Message from '../components/Message.vue'

let messageInstance = null

const createMessage = (options) => {
    const container = document.createElement('div')
    
    const vnode = createVNode(Message, {
        ...options,
        onDestroy: () => {
            render(null, container)
            document.body.removeChild(container)
            messageInstance = null
        }
    })
    
    render(vnode, container)
    document.body.appendChild(container)
    
    messageInstance = vnode
    
    return messageInstance
}

const message = {
    info(message, duration = 3000) {
        return createMessage({ message, type: 'info', duration })
    },
    success(message, duration = 3000) {
        return createMessage({ message, type: 'success', duration })
    },
    warning(message, duration = 3000) {
        return createMessage({ message, type: 'warning', duration })
    },
    error(message, duration = 3000) {
        return createMessage({ message, type: 'error', duration })
    }
}

export default message 