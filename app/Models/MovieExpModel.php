<?php

namespace App\Models;

use CodeIgniter\Model;

class MovieExpModel extends Model{
    protected $table            = "movie_exp";
    protected $primaryKey       = "id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'movie_id',
        'exp_id'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>