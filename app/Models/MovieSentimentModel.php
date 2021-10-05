<?php

namespace App\Models;

use CodeIgniter\Model;

class MovieSentimentModel extends Model{
    protected $table            = "movie_sentiment";
    protected $primaryKey       = "id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'movie_id',
        'no_pos',
        'no_neg',
        'avg_comp',
        'since_id'
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>