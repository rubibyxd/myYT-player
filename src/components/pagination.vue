<template>
    <div id="pagination">
        <div class="page-btn-container">
            <div class="handle-btn" @click.stop="prePage()" :disabled="setDisablePrev(nowPage)">
                <font-awesome-icon class="handle-left" :icon="['fas', 'caret-left']" />
                上一頁
            </div>
            <div class="main-btn-container">
                <div v-if="nowPage >= pageRange" class="page-btn" @click.stop="firstPage()">1</div>
                <div v-if="isPreFiveShow()" class="page-btn" @click.stop="preFive()">...</div>
                <div
                v-for="(item,index) in totalBtns[pageIndex]" 
                class="page-btn"
                :key="index"
                :class="{'btn--active':nowPage === item }"
                @click="currentPage(item)">
                {{ item + 1 }}
                </div>
                <div v-if="isNextFiveShow()" class="page-btn" @click.stop="nextFive()">...</div>
                <div v-if="pageIndex !== totalBtns.length - 1" class="page-btn" @click.stop="lastPage()">{{ totalPage.length }}</div>
            </div>
            <div class="handle-btn" @click.stop="nextPage()" :disabled="setDisableNext(nowPage)">
                下一頁
                <font-awesome-icon class="handle-right" :icon="['fas', 'caret-right']" />
            </div>
        </div>   
    </div>
</template>
<script>
export default {
    name:'Pagination',
    props:{
        sendTotalPage: {
            type: Array,
            required: true
        },
        value: {
            type: Number,
            default: 0,
            required: true
        },
    },
    data() {
        return {
            totalBtns:[],
            nowPage: 0,
            totalPage: [],
            pageRange:5,
            pageArr:[],
            pageIndex:0,
            isDisabledPrev:false,
            isDisabledNext:false,
        }
    },
    methods: {
        nextPage(){
            if(this.nowPage + 1 < this.totalPage.length)
            this.nowPage += 1
        },
        prePage(){
            if(this.nowPage - 1 >= 0)
                this.nowPage -= 1
        },
        preFive(){
        if(this.nowPage - 5 >= 0)
            this.nowPage = this.nowPage - 5
        },
                firstPage(){
            this.nowPage = 0
        },
        lastPage(){
            this.nowPage = this.totalPage.length - 1
        },
        nextFive(){
        if(this.nowPage + 5 < this.totalPage.length)
            this.nowPage = this.nowPage + 5
        },
        currentPage(pageNum){
            this.nowPage = parseInt(pageNum)
        },
        createPageArr(){
            let arr = JSON.parse(JSON.stringify(this.totalPage))
            let newArr = []
            arr.forEach((item,index) => {
                const page = parseInt(index / this.pageRange)
                if( index % this.pageRange === 0){
                newArr.push([])
                }
                newArr[page].push(index)
            })
            this.totalBtns = newArr
            this.pageArr = newArr[this.pageIndex]
        },
        setDisablePrev(pageData){
            if(pageData === 0){
                return this.isDisabledPrev = true
            }else{
                return this.isDisabledPrev = false
            }
        },
        setDisableNext(pageData){
            if(pageData === this.totalPage.length - 1){
                return this.isDisabledNext = true
            }else{
                return this.isDisabledNext = false
            }
        },
        isPreFiveShow() {
            const totalPageLen = this.totalPage.length
            return (this.nowPage >= this.pageRange) && (totalPageLen > this.pageRange)
        },
        isNextFiveShow() {
            const totalPageLen = this.totalPage.length
            return this.nowPage !== totalPageLen - 1 && this.pageIndex !== this.totalBtns.length - 1
        }
    },
    watch: {
        nowPage(data) {
            this.pageIndex = parseInt(data / this.pageRange)
            this.$emit('input', data) // v-model
        },
        sendTotalPage(data) {
            if (data && data.length > 0) {
                this.totalPage = data
                this.createPageArr()
            }
        },
        value(data) {
            const newData = JSON.parse(JSON.stringify(data))
            this.nowPage = newData // v-model
        },
    }
}
</script>
<style lang="scss" scoped>
    #pagination{
        .page-btn-container{
            display: flex;
            font-weight: bold;
            .handle-btn{
                padding:5px 20px;
                background-color: #FF4299;
                color: #141010;
                border-radius: 5px;
                text-align: center;
                line-height: 2;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: 0.3s;
                user-select: none;
                .handle-left {
                    font-size: 24px;
                    margin-right: 20px;
                }
                .handle-right {
                    font-size: 24px;
                    margin-left: 20px;
                }
                &:hover {
                    background-color: #e21a77;
                    color: #F0F0F0;
                }
            }
            .main-btn-container{
                display: flex;
                align-items: center;
                text-align: center;
                .page-btn{
                    width: 50px;
                    height: 100%;
                    margin: 0 10px;
                    color: #FF4299;
                    border-radius: 5px;
                    line-height: 2.5;
                    cursor: pointer;
                }
                .btn--active{
                    background-color: #FF4299;
                    color: #141010
                }
            }
        }
        
    }
</style>