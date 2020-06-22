<?php
    require '_class.php';
    
    function print_pre($data)
    {
        echo '<pre>';
        print_r($data);
        echo '</pre>';
    }
    
    class Application
    {
        static function version()
        {
            $commitHash = trim(exec('git log --pretty="%h" -n1 HEAD'));
            
            try {
                $commitDate = new DateTime(trim(exec('git log -n1 --pretty=%ci HEAD')));
            } catch (Exception $e) {
                $commitDate = '';
            }
            $commitDate->setTimezone(new \DateTimeZone('UTC'));
            
            echo sprintf('%s (%s)', $commitHash, $commitDate->format('Y-m-d H:i:s'));
        }
        
        static function dir(): void
        {
            echo '<h3>Videos Folder</h3>';
            print_pre(scandir("videos"));
        }
        
        static function ffmpeg()
        {
            $ffmpeg = new FFMPEG();
            return file_exists($ffmpeg->ffmpeg) && file_exists($ffmpeg->ffprobe);
        }
    }
    
    echo '<h2>VERSION</h2>';
    Application::version();
    
    echo '<h2>DIR</h2>';
    Application::dir();
    
    echo '<h2>FFMPEG</h2>';
    if (!Application::ffmpeg()) {
        echo "FFMPEG is not installed and linked!";
    } else {
        $ffmpeg = new FFMPEG();
        echo sprintf("<p>ffmpeg=%s</p>", $ffmpeg->ffmpeg);
        echo sprintf("<p>ffprobe=%s</p>", $ffmpeg->ffprobe);
    }