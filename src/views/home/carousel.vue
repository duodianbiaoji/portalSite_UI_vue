<template>
        <div >
            <el-carousel type="card" style="margin-top: 20px;"  height="500px" >
                <el-carousel-item v-for="item in 4" :key="item">
                 
                </el-carousel-item>
            </el-carousel>
        </div>
</template>
<style>
.el-carousel__item:nth-child(2n){
    background-image: url('../../assets/images/beijing.png');
    background-size: 100% 100%;

    }
.el-carousel__item:nth-child(2n+1){
     background-image: url('../../assets/images/banner.png');
     background-size: 100% 100%;
    }
</style>