
var $ = require('./common/libs/zepto-modules/zepto');
require('./common/libs/zepto-modules/event');
require('./common/libs/zepto-modules/ajax');
require('./common/libs/zepto-modules/touch');

var swiperAni=require('./common/libs/swiper/swiper.animate1.0.2.min.js');
var Swiper=require('./common/libs/swiper/swiper.min.js');
var IScroll=require('./common/libs/iscroll/iscroll.js');
var myScroll;

if(localStorage.name){
	$('#mainContent').show();
	$('.swiper-container').remove();
	
	$.post('http://localhost:8000/myskill',function(data){
			var html="";
			for(var i=0;i<data.length;i++){
				html+='<li><div><img src="'+data[i].img+'"></div><div>'+data[i].name+'</div></li>';
			}
			$('#scroller ul').html(html);
			$('#scroller ul').removeClass();
			$('#scroller ul').addClass('skillPage');
			myScroll = new IScroll('#wrapper', { mouseWheel: true });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	})
}else{
	$('.swiper-container').show();
	$('#mainContent').hide();
}

	var swiper = new Swiper('.swiper-container',{
          onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
            swiperAni.swiperAnimateCache(swiper); //隐藏动画元素 
            swiperAni.swiperAnimate(swiper); //初始化完成开始动画
          }, 
          onSlideChangeEnd: function(swiper){ 
            swiperAni.swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
          } 
    });
	
	$('.btn a').tap(function(){
		$('.swiper-container').hide();
		$('#mainContent').show();
		localStorage.name=true;
		$.post('http://localhost:8000/myskill',function(data){
			var html="";
			for(var i=0;i<data.length;i++){
				html+='<li><div><img src="'+data[i].img+'"></div><div>'+data[i].name+'</div></li>';
			}
			$('#scroller ul').html(html);
			$('#scroller ul').removeClass();
			$('#scroller ul').addClass('skillPage');
			myScroll = new IScroll('#wrapper', { mouseWheel: true });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		})
	})

$('#footer').children('div').tap(function(){
	$(this).addClass("select-active").siblings("div").removeClass("select-active");
	$("#header .message").eq($(this).index()).show().siblings(".message").hide();
	var targetApi=$(this).attr('id');
	$.post('http://localhost:8000/'+targetApi,function(data){
		var html="";
		switch(targetApi){
			case('myskill'): 
				for(var i=0;i<data.length;i++){
					html+='<li><div><img src="'+data[i].img+'"></div><div>'+data[i].name+'</div></li>';
				};

				$('#scroller ul').removeClass();
				$('#scroller ul').addClass('skillPage');
				break;

			case('project'): 
				for(var i=0;i<data.length;i++){
					html+='<li><div><img src="' + data[i].image + '"></div><div><div><span>Category：</span><span>' + data[i].category + '</span></div><div><span>Name：</span><span>' + data[i].name + '</span></div><div><span>URL：</span><span>' + data[i].url + '</span></div><div><span>Tech：</span><span>' + data[i].tech + '</span></div><div><span>Description：</span><span>' + data[i].description + '</span></div><div><span>Detail：</span><span>' + data[i].detail + '</span></div></div></li>';
				};
				$('#scroller ul').removeClass();
				$('#scroller ul').addClass('projectPage');
				break;

			case('work'): 
				for(var i=0;i<data.length;i++){
					html+='<li><div><img src="' + data[i].image + '"></div><div><div><span>Category：</span><span>' + data[i].category + '</span></div><div><span>Name：</span><span>' + data[i].name + '</span></div><div><span>URL：</span><span>' + data[i].url + '</span></div><div><span>Time：</span><span>' + data[i].time + '</span></div><div><span>Posts：</span><span>' + data[i].posts + '</span></div><div><span>ReportTo：</span><span>' + data[i].reportto + '</span></div><div><span>Peoples：</span><span>' + data[i].peoples + '</span></div><div><span>Projects：</span><span>' + data[i].projects + '</span></div></div></li>';
				};
				$('#scroller ul').removeClass();
				$('#scroller ul').addClass('projectPage');
				break;

			case('me'):
				for(var i=0;i<data.length;i++){
					html+='<li><div><span>' + data[i].title + '</span><span>' + data[i].info + '</span></div></li>';
				};
				html+='<li><div><span>微　　信：</span><span><img src="../img/myself.jpg"></span></div></li>';
				$('#scroller ul').removeClass();
				$('#scroller ul').addClass('mePage');
				break;

		}
		
		$('#scroller ul').html(html);
		myScroll.scrollTo(0,0);
		myScroll.refresh();
	})
})
	//二维码
	var isScan=true;
	$('.scanbtn').on('singleTap',function(){
		if (isScan) {
			$('.scan').show();
			isScan=false;
		}else{
			$('.scan').show();
			isScan=false;
		}
	})
	//music
	var isPlay=true;
	$('.myMusic').singleTap(function(){
		if(isPlay){
			$('audio')[0].pause();
			$(this).css('animation-play-state','paused');
			isPlay=false;
		}else{
			$('audio')[0].play();
			$(this).css('animation-play-state','running');
			isPlay=true;
		}
	})
