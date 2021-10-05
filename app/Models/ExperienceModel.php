<?php

namespace App\Models;

use CodeIgniter\Model;

class ExperienceModel extends Model{
    protected $table            = "experiences";
    protected $primaryKey       = "exp_id";
    protected $useSoftDeletes   = false;
    protected $useAutoIncrement = true;
    protected $returnType       = "array";
    protected $allowedFields    = [
        'name',
        'description',
        'surcharge',
        'logo'
    ];
    protected $useTimeStamps    = true;
    protected $createdField     = "created_at";
    protected $updatedField     = "updated_at";
    //protected $deleted_at     = "deleted_at";
}

?>