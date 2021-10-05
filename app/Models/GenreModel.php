<?php

namespace App\Models;

use CodeIgniter\Model;

class GenreModel extends Model{
    protected $table            = "genre";
    protected $primaryKey       = "genre_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'genre',
        'updated_at'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>