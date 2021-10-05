<?php

namespace App\Models;

use CodeIgniter\Model;

class SnacksModel extends Model{
    protected $table            = "snacks";
    protected $primaryKey       = "snack_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'name',
        'price',
        'img',
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>