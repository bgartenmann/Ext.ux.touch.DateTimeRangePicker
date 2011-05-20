# Delineate the directory for our SASS/SCSS files (this directory)
sass_path = File.dirname(__FILE__)

# Delineate the CSS directory (under resources/css in this demo)
css_path = sass_path

# Delinate the images directory
images_dir = File.join(sass_path, "images")

# Specify the output style/environment
output_style = :compressed
environment = :production