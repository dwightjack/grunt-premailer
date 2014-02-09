require 'rubygems'
require 'optparse'
require 'premailer'

premailer = nil

options = {
  :base_url => nil,
  :link_query_string => nil,
  :remove_classes => false,
  :remove_comments => false,
  :verbose => false,
  :line_length => 65,
  :preserve_styles => false
}

file_in = nil
file_out = nil
mode = nil


opts = OptionParser.new do |opts|
  opts.banner = "Improve the rendering of HTML emails by making CSS inline among other things. Takes a path to a local file, a URL or a pipe as input.\n\n"
  opts.define_head "Usage: premailer <optional uri|optional path> [options]"
  opts.separator ""
  opts.separator "Examples:"
  opts.separator "  premailer http://example.com/ > out.html"
  opts.separator "  premailer http://example.com/ --mode txt > out.txt"
  opts.separator "  cat input.html | premailer -q src=email > out.html"
  opts.separator "  premailer ./public/index.html"
  opts.separator ""
  opts.separator "Options:"

  opts.on("--mode MODE", [:html, :txt], "Output: html or txt") do |v|
    mode = v
  end

  opts.on("--preserve-styles", "Preserve link and style tags") do |v|
    options[:preserve_styles] = v
  end

  opts.on("-b", "--base-url STRING", String, "Base URL, useful for local files") do |v|
    options[:base_url] = v
  end

  opts.on("-q", "--query-string STRING", String, "Query string to append to links") do |v|
    options[:link_query_string] = v
  end

  opts.on("--css FILE,FILE", Array, "Additional CSS stylesheets") do |v|
    options[:css] = v
  end

  opts.on("-r", "--remove-classes", "Remove HTML classes") do |v|
    options[:remove_classes] = v
  end

  opts.on("--remove-comments", "Remove HTML comments") do |v|
    options[:remove_comments] = v
  end

  opts.on("-l", "--line-length N", Integer, "Line length for plaintext (default: #{options[:line_length].to_s})") do |v|
    options[:line_length] = v
  end

  opts.on("-d", "--io-exceptions", "Abort on I/O errors") do |v|
    options[:io_exceptions] = v
  end

  opts.on("-v", "--verbose", "Print additional information at runtime") do |v|
    options[:verbose] = v
  end

  opts.on("--file-in STRING", String, "Input filename") do |v|
    file_in = v
  end
  opts.on("--file-out STRING", String, "Output filename") do |v|
    file_out = v
  end
end
opts.parse!

$stderr.puts "Processing in #{mode} mode with options #{options.inspect}" if options[:verbose]

if file_in
  premailer = Premailer.new(file_in, options)
else
  puts opts
  exit 1
end


if file_out
  # Write the HTML output
  fout = File.open(file_out, "wb")
  if mode == :txt
    fout.puts premailer.to_plain_text
  else
    fout.puts premailer.to_inline_css
  end
  fout.close
end

premailer.warnings.each do |w|
  puts "#{w[:message]} (#{w[:level]}) may not render properly in #{w[:clients]}"
end

exit
