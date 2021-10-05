<?php

namespace App\Models;

use CodeIgniter\Model;

class BannersModel extends Model{
    protected $table            = "banners";
    protected $primaryKey       = "banner_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'img',
        'link',
        'status',
    ];
    protected $useTimeStamps    = true;
    //protected $createdField     = "created_at";
    //protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>