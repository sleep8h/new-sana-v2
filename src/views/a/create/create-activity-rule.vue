<template>
    <div class="create-activity-ruleBox">
        <div class="backup-box"></div>
        <div class="safe-mainBox">
            <div class="nav-rule-container">
                <navBar :isText="true" themeType="black" :rightLink="true" @onLeftClick="back">
                    <template #center>{{ t('ativity.create.title') }}</template>
                </navBar>
            </div>
            <div class="scroll-container-rule" >
                <div class="rule-item">
                    <p>{{ t('ativity.create.rule1') }}</p>
                    <div class="rule-img-box">
                        <img src="@/assets/a/create/group1@2x.png" alt=""></img>
                    </div>
                </div>
                <div class="rule-item">
                    <p>{{ t('ativity.create.rule2') }}</p>
                    <div class="rule-img-box"> 
                        <img src="@/assets/a/create/group2@2x.png" alt=""></img>
                    </div>
                </div>
                <div class="rule-item">
                    <p>{{ t('ativity.create.rule3') }}</p>
                     <div class="rule-img-box"> 
                        <img src="@/assets/a/create/group3@2x.png" alt=""></img>
                    </div>
                </div>
                <div id="ruleApp">

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import navBar from '@/components/navBar/navBar.vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useMainStore } from '@/pinia/index.js'
const store = useMainStore()

const back = () => {
   WebViewJavascriptBridge.backToFront(null, null)
}

onMounted(() => {
//    if(store.os === 'android') {
    //    let result = WebViewJavascriptBridge.gainTicket(null, null)
    //    document.getElementById('ruleApp').innerHTML = 'result:'+ JSON.stringify(result)

//    } 
})
</script>

<style scoped>
.create-activity-ruleBox{
    width: 100%;
    height: 100vh;
    position: relative;
}

.backup-box {
    width: 100%;
    height: 320px;
    background: url('@/assets/p/guild/search/guild-create-bg@2x.png') no-repeat;
    background-size: 100% 100%;
}

.safe-mainBox {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
}

.nav-rule-container {
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    margin-top:48px;
}

.scroll-container-rule{
    width: 100%;
    height: calc(100% - 96px);
    box-sizing: border-box;
    padding: 16px;
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.rule-img-box{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.rule-item img{
    width: 80%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.rule-item p{
    font-size: 16px;
    padding-bottom: 8px;
}

</style>