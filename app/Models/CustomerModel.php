<?php

namespace App\Models;

use CodeIgniter\Model;

class CustomerModel extends Model{
    protected $table            = "customer";
    protected $primaryKey       = "id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'name',
        'email',
        'password',
        'phone',
        'address'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>