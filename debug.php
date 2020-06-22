<?php
    
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
            
            $commitDate = new DateTime(trim(exec('git log -n1 --pretty=%ci HEAD')));
            $commitDate->setTimezone(new \DateTimeZone('UTC'));
            
            echo sprintf('%s (%s)', $commitHash, $commitDate->format('Y-m-d H:i:s'));
        }
        
        static function dir(): void
        {
            echo '<h3>Videos Folder</h3>';
            print_pre(scandir("videos"));
        }
    }
    
    echo '<h2>VERSION</h2>';
    Application::version();
    
    echo '<h2>DIR</h2>';
    Application::dir();