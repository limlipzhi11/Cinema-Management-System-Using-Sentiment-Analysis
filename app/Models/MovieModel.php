<?php

namespace App\Models;

use CodeIgniter\Model;

class MovieModel extends Model{
    protected $table            = "movies";
    protected $primaryKey       = "movie_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'title',
        'cast',
        'director',
        'distributor',
        'synopsis',
        'price',
        'duration',
        'show_start',
        'show_end',
        'poster',
        'trailer',
        'updated_at'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>