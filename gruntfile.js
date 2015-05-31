module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jade: {
			compile: {
				options: {
					pretty: true,
					debug: false
				},
				files: [
					{
						src: "*.jade",
						cwd: "views/src",
						dest: "views",
						expand: true,
						ext: ".handlebars"
					},
					{
						src: "*.jade",
						cwd: "views/src/layouts",
						dest: "views/layouts",
						expand: true,
						ext: ".handlebars"
					}
				]
			}
		},
		stylus: {
			compile: {
				options: {
					compress: false
				},
				files: {
					'public/src/styles-unprefixed.css': 'public/src/styles.styl'
				}
			}
		},
		autoprefixer: {
			single_file: {
				src: 'public/src/styles-unprefixed.css',
				dest: 'public/styles.css'
			}
		},
		watch: {
			html: {
				files: ['views/src/*.jade', 'views/src/layouts/*.jade'],
				tasks: ['jade'],
				options: {
					spawn: false
				}
			},
			css: {
				files: ['public/src/styles.styl'],
				tasks: ['stylus', 'autoprefixer'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jade', 'stylus', 'autoprefixer', 'watch']);

};
