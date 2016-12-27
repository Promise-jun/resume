var gulp=require('gulp');//基础gulp模块
var webserver=require('gulp-webserver');//webserver服务器模块
var url=require('url');
var fs=require('fs');//fs  filesystem
var sass=require('gulp-sass');
var webpack=require('gulp-webpack');
var uglify=require('gulp-uglify');
var minifyCss=require('gulp-minify-css');
var rev=require('gulp-rev');
var revCollector=require('gulp-rev-collector');
var watch=require('gulp-watch');
var sequence=require('gulp-watch-sequence');
var named=require('vinyl-named');

gulp.task('copy-index',function(){
	return gulp.src('./src/index.html')
	.pipe(gulp.dest('./www'));
})
gulp.task('copy-img',function(){
	return gulp.src('./src/img/**')
	.pipe(gulp.dest('./www/img'));
})


gulp.task('webserver',function(){
	gulp.src('./www')
	.pipe(webserver({
		livereload:true,
		//directoryListing:true,//目录结构
		open:true,
		middleware:function(req,res,next){
			
			var urlObj=url.parse(req.url,true),
			method=req.method;
			
			switch(urlObj.pathname){
				case '/skill':
				res.setHeader('Content-Type','application/json');
				fs.readFile('./mock/skill.json','utf-8',function(err,data){
					res.end(data);
				});
				return;

				case '/project':
				res.setHeader('Content-Type','application/json');
				fs.readFile('./mock/project.json','utf-8',function(err,data){
					res.end(data);
				});
				return;

				case '/work':
				res.setHeader('Content-Type','application/json');
				fs.readFile('./mock/work.json','utf-8',function(err,data){
					res.end(data);
				});
				return;
				case '/myskill':
				res.setHeader('Content-Type','application/json');
				fs.readFile('./mock/myskill.json','utf-8',function(err,data){
					res.end(data);
				});
				return;
				case '/me':
				res.setHeader('Content-Type','application/json');
				fs.readFile('./mock/me.json','utf-8',function(err,data){
					res.end(data);
				});
				return;
			}
			next();//next是实现循环
		}//end middleware
	}));//end gulp
})





gulp.task('sass',function(){
	return gulp.src('./src/styles/index.scss')
	.pipe(sass())
	.pipe(minifyCss())
	.pipe(gulp.dest('./www/css'))
})

gulp.task('packjs',function(){
	return gulp.src('./src/scripts/index.js')
	.pipe(named())
	.pipe(webpack())
	.pipe(uglify())
	.pipe(gulp.dest('./www/js'))
})

//版本管理操作
var cssDistFiles=['./www/css/index.css'];
var jsDistFiles=['./www/js/index.js'];

gulp.task('verCss',function(){
	return gulp.src(cssDistFiles)
	.pipe(rev())
	.pipe(gulp.dest('./www/css'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('./www/ver/css'))
})

gulp.task('verjs',function(){
	return gulp.src(jsDistFiles)
	.pipe(rev())
	.pipe(gulp.dest('./www/js'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('./www/ver/js'))
})
//字符串替换              
gulp.task('html',function(){
	gulp.src(['./www/ver/**/*.json','./www/*.html'])
	.pipe(revCollector({
		replaceReved:true
	}))
	.pipe(gulp.dest('./www'))
})



gulp.task('watch',function(){
	gulp.watch('./src/index.html',['copy-index']);
	gulp.watch('./src/styles/index.scss',['sass']);
	gulp.watch('./src/img',['copy-img']);

	var queue=sequence(300);
	watch('./src/scripts/**',{
		name:"JS",
		emitOnGlob:false
	},queue.getHandler('packjs','verjs','html'));

	watch('./src/styles/**',{
		name:"CSS",
		emitOnGlob:false
	},queue.getHandler('sass','verCss','html'));
});

gulp.task('default',['webserver','watch']);