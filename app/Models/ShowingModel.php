<?php

namespace App\Models;

use CodeIgniter\Model;

class ShowingModel extends Model{
    protected $table            = "showing";
    protected $primaryKey       = "showing_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'hall_id',
        'schedule_id',
        'exp_id',
        'movie_id',
        'duration',
        'name',
        'price',
        'start_time',
        'end_time',
        'show_date',
        'enabled_by',
        'seating',
        'num_seats'
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>