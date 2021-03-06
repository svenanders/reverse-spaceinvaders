ig.module('game.entities.ufo').
requires('impact.entity').defines(function ()
{
    EntityUfo = ig.Entity.extend(
    {
        size: {
            x: 104,
            y: 38
        },
        offset: {
            x: 0,
            y: 0
        },
        vel: {
            x:100,
            y:0
        },
        maxVel: {
            x: 2500,
            y: 5
        },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,
        health: 100,
        shootTimer: null,
        shootWaitTimer: null,
        reverseTimer: null,
        blinkTimer: null,
        move: 'left',
        direction_set: false,
        canShoot: false,
        scaleTimer: new ig.Timer(0),
        animSheet: new ig.AnimationSheet('media/alien.png', 104, 38),
        sfxShoot: new ig.Sound('media/sounds/shoot1.*'),
        
        sfxHit: new ig.Sound('media/sounds/shoot1.*'),
        scale: { x: 1, y: 1 },  //user-defined scale
        _offset: { x: 0, y: 0 },    //cached offset prior to scaling
        _scale: { x: 1, y: 1 }, //scale relative to ig.system.scale
        _size: { x: 254, y: 121 },  //cached size prior to scaling
        

        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.shootWaitTimer = new ig.Timer(1);
            this.blinkTimer = new ig.Timer(0);
            this.shootTimer = new ig.Timer(Math.random() * 8);
            this.reverseTimer = new ig.Timer(3.5);
            this.addAnim('idle', 0.5, [0]);
            this.addAnim('shoot', 0.5, [0]);
            this.addAnim('hit', 0.1, [2]);
            this.addAnim('die', 0.1, [1]);
            
            this._offset.x = this.offset.x;
            this._offset.y = this.offset.y;
            this._size.x = this.size.x;
            this._size.y = this.size.y;
           // this.setScale( this.scale.x, this.scale.y );

        },
        update: function ()
        {
            this.direction_set=false
            
        if(this.blinkTimer.delta() > 0){
        this.currentAnim.alpha = 1;
        }

            var maxX = ig.game.collisionMap.width  * ig.game.collisionMap.tilesize;
            var maxY = ig.game.collisionMap.height * ig.game.collisionMap.tilesize;
 /*
            if(this.pos.x >= maxX && this.direction_set===false){
                 this.move = 'left'
                 this.direction_set=true
            }
           
            if(this.pos.x <= -0 && this.direction_set===false){
                 this.move='right';
                 this.direction_set=true
            }
*/
          
/*
            for(i=0;i<ig.game.getEntitiesByType(EntityUfo).length;i++){
                if(ig.game.getEntitiesByType(EntityUfo )[i].pos.x <= -0){
                if(this.direction_set===false){
                 this.move='right';
                 this.direction_set=true
                }
                }
            }

            for(i=0;i<ig.game.getEntitiesByType(EntityUfo).length;i++){
                if(ig.game.getEntitiesByType(EntityUfo )[i].pos.x >= maxX){
            if(this.direction_set===false){
                 this.move='left';
                 this.direction_set=true
                }
                }
            }
        
            for(i=0;i<ig.game.getEntitiesByType(EntityUfo).length;i++){
                ig.game.getEntitiesByType(EntityUfo )[i].move=this.move
                if(this.move==='left') ig.game.getEntitiesByType(EntityUfo)[i].vel.x=-200
                    else ig.game.getEntitiesByType(EntityUfo)[i].vel.x=200
             }
         */
            
            if(this.shootTimer.delta() > 0){
                 this.sfxShoot.play();
            ig.game.spawnEntity(EntityUFOProjectile, this.pos.x+44, this.pos.y+17, {
                    flip: this.flip
                });

          
            this.shootTimer.set(Math.random() * 10)
            }

            if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount)
            {
                this.currentAnim = this.anims.idle;
                this.shootWaitTimer.set(0.5);
            }
            else if (this.currentAnim == this.anims.idle && this.shootWaitTimer.delta() > 0 && this.distanceTo(ig.game.player) < 80)
            {
                this.currentAnim = this.anims.shoot.rewind();
                this.shootTimer.set(10);
                this.canShoot = true;
            
            }
            this.parent();
            
        },
        kill: function ()
        {
            //ig.game.screentext="500";
            this.currentAnim=this.anims.die
        
            //ig.game.score+=500;
            this.spawnGibs(100);
            this.parent();
        },
        check: function (other)
        {
        //    other.receiveDamage(10, this);
        },  
        receiveDamage: function (amount, from)
        {
        this.blinkTimer.set(0.2)
        var maxAlpha = this.health/100;
        var minAlpha = maxAlpha/10;
        this.currentAnim.alpha = 0.5;
        this.currentAnim=this.anims.hit
        if(this.health<=10){
         this.currentAnim=this.anims.die
        }
            this.currentAnim = this.anims.hit.rewind();
           // this.spawnGibs(1);
           // this.scaleTimer.set(0.05);
           // this.setScale( (ig.system.scale+1), (ig.system.scale+0.2) );   

            this.parent(amount);
            
            this.sfxHit.play();
        },
        spawnGibs: function (amount)
        {
            var cx = this.pos.x + this.size.x / 1;
            var cy = this.pos.y + this.size.y / 1;
            for (var i = 0; i < amount; i++)
            {
         ////       ig.game.spawnEntity(EntityFroskGib, cx, cy);
            }
        },
            draw: function(){
            var ctx = ig.system.context;
            ctx.save();
            ctx.translate(
            ig.system.getDrawPos( this.pos.x.round() - this.offset.x - ig.game.screen.x ),
            ig.system.getDrawPos( this.pos.y.round() - this.offset.y - ig.game.screen.y )
            );
            ctx.scale( this._scale.x, this._scale.y );
            this.currentAnim.draw( 0, 0 );
            ctx.restore();
            },

            setScale: function( x, y ){
            //cache size prior to scaling
            var oX = this.size.x,
            oY = this.size.y;

            //set scale
            this.scale.x = x || this.scale.x;
            this.scale.y = y || this.scale.y;

            //set scale relative to game scale
            this._scale.x = this.scale.x / ig.system.scale;
            this._scale.y = this.scale.y / ig.system.scale;

            //scale offset
            this.offset.x = this._offset.x * this._scale.x;
            this.offset.y = this._offset.y * this._scale.y;

            //scale size
            this.size.x = this._size.x * this._scale.x;
            this.size.y = this._size.y * this._scale.y;

            //offset entity's position by the change in size
            this.pos.x += (oX - this.size.x) / 0.2;
            this.pos.y += (oY - this.size.y) / 0.2;
            }
    });
   
 EntityUFOProjectile = ig.Entity.extend(
    {
        size: {
            x: 4,
            y: 34
        },
        offset: {
            x: 0,
            y: 0
        },
        maxVel: {
            x: 0,
            y: 500
        },
        vel: {
           x: 0,
            y: 500
        },

        gravityFactor: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        flip: false,
        hasHit: false,
        lifetime: 2,
        animSheet: new ig.AnimationSheet('media/laserbeam_red_vert.png', 4, 34),
        init: function (x, y, settings)
        {
            this.parent(x, y, settings);
            this.vel.x=0
            this.vel.y=500
            //this.vel.y = (settings.flip ? this.maxVel.y : this.maxVel.y);
            //this.offset.y = (settings.flip ? 75 : this.offset.y);
            this.addAnim('idle', 1, [0]);
            this.addAnim('hit', 0.1, [0], true);
            this.idleTimer = new ig.Timer();
        },
        update: function ()
        {
            
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }

            if (this.hasHit)
            {
                this.kill();
            }
            this.parent();
            this.currentAnim.flip.x = this.flip;
        },
        handleMovementTrace: function (res)
        {
            this.parent(res);
            if (res.collision.x || res.collision.y)
            {
                this.currentAnim = this.anims.hit;
                this.hasHit = true;
                console.log("hashit")
            }
        },
        check: function (other)
        {
            if (!this.hasHit)
            {
            
                other.receiveDamage(50, this);
                this.hasHit = true;
                this.currentAnim = this.anims.hit;
                this.vel.x = 0;
                
            }
        }
        });
       


});
