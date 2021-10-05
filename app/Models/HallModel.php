<?php

namespace App\Models;

use CodeIgniter\Model;

class HallModel extends Model{
    protected $table            = "hall";
    protected $primaryKey       = "hall_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'exp_id',
        'updated_at'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>