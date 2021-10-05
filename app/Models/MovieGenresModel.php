<?php

namespace App\Models;

use CodeIgniter\Model;

class MovieGenresModel extends Model{
    protected $table            = "movie_genres";
    protected $primaryKey       = "id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'movie_id',
        'genre_id'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>