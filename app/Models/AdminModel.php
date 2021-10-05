<?php

namespace App\Models;

use CodeIgniter\Model;

class AdminModel extends Model{
    protected $table            = "admin";
    protected $primaryKey       = "id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'name',
        'email',
        'password',
        'admin_group'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>