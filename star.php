<?php
    include('_class.php');
    $basic = new Basic();
    $stars = new Star();
    $db = new DB();

    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $id = $_GET['id'];
    }
?>

<!doctype html>
<html>
    <head>
        <?php $basic->head($stars->getStar($id), array('bootstrap', 'jqueryui', 'contextmenu', 'autocomplete', 'star', 'flags'), array('bootstrap', 'jqueryui', 'contextmenu', 'autocomplete', 'star')) ?>
    </head>

    <body>
        <nav>
            <?php $basic->navigation() ?>
        </nav>

        <main class="container-fluid">
            <div class="row no-gutters">
                <div class="col-12 alert alert-danger px-2 h5 d-none" id="alert-container">Same Star?</div>

                <section class="col-7">
                    <?php
                        $stars->fetchStar($id);

                        if (isset($_POST['freeones']) && !empty($_POST['freeones']) && !$db->ignoredStar($db->getStarName($id))) {
                            $stars->freeOnes_new($id);
                        } else if (isset($_POST['freeones_rs']) && !empty($_POST['freeones_rs'])) {
                            $stars->freeOnes_reset($id);
                        }

                    ?>
                </section>

                <aside class="col-5 card">
                    <h2 class="card-header text-center">Similar Stars</h2>
                    <div class="card-body">
                        <?php
                            $stars->fetchSimilar($id);
                        ?>
                    </div>
                </aside>
            </div>
        </main>
    </body>
</html>