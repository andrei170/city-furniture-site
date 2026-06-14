/* City Furniture & Appliances - shared behaviour */
(function(){
  var STORES = [
    {city:"Prince George", prov:"British Columbia", stock:3120},
    {city:"Kamloops", prov:"British Columbia", stock:2740},
    {city:"West Kelowna", prov:"British Columbia", stock:2380},
    {city:"Quesnel", prov:"British Columbia", stock:1460},
    {city:"Williams Lake", prov:"British Columbia", stock:1280},
    {city:"Vanderhoof", prov:"British Columbia", stock:980},
    {city:"Terrace", prov:"British Columbia", stock:1640},
    {city:"Salmon Arm", prov:"British Columbia", stock:1520},
    {city:"Merritt", prov:"British Columbia", stock:1120},
    {city:"Grande Prairie", prov:"Alberta", stock:2860},
    {city:"Fort McMurray", prov:"Alberta", stock:2210},
    {city:"Lethbridge", prov:"Alberta", stock:2590},
    {city:"Whitecourt", prov:"Alberta", stock:1340}
  ];

  function active(){ try{ return parseInt(localStorage.getItem('cf_store')||'0',10)||0; }catch(e){ return 0; } }
  function setActive(i){ try{ localStorage.setItem('cf_store', String(i)); }catch(e){} }

  function applyStore(i){
    setActive(i);
    var s = STORES[i];
    function setText(sel, txt){ var els=document.querySelectorAll(sel); for(var k=0;k<els.length;k++){ els[k].textContent = txt; } }
    setText('#storeBtnCity', s.city);
    setText('#panelCity', s.city);
    setText('#panelProv', s.prov);
    setText('.storeCity', s.city);
    var hs=document.getElementById('heroStore'); if(hs) hs.textContent='your '+s.city;
    var hs2=document.getElementById('heroStore2'); if(hs2) hs2.textContent=s.city;
    var ps=document.getElementById('panelStock'); if(ps) ps.textContent=s.stock.toLocaleString();
    var mapf=document.getElementById('storeMap'); if(mapf){ mapf.src='https://www.google.com/maps?q='+encodeURIComponent('City Furniture & Appliances '+s.city+' '+s.prov)+'&output=embed'; }
    var mc=document.getElementById('mapCity'); if(mc) mc.textContent=s.city;
    var ml=document.getElementById('mapLink'); if(ml) ml.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('City Furniture & Appliances '+s.city+' '+s.prov);
    var stk=document.querySelectorAll('.storeStk');
    for(var j=0;j<stk.length;j++){ stk[j].innerHTML='<span class="dotpulse"></span> '+s.city; }
    var locs=document.querySelectorAll('.loc-card');
    for(var l=0;l<locs.length;l++){ locs[l].classList.toggle('active', l===i); }
    var mss=document.querySelectorAll('.ms');
    for(var m=0;m<mss.length;m++){ mss[m].classList.toggle('sel', m===i); }
  }

  function buildStoreLists(){
    var grid=document.getElementById('locGrid');
    var msList=document.getElementById('msList');
    for(var i=0;i<STORES.length;i++){
      (function(idx){
        if(grid){
          var dirUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('City Furniture & Appliances '+STORES[idx].city+' '+STORES[idx].prov);
          var d=document.createElement('a');
          d.className='loc-card'; d.href='#';
          d.innerHTML='<div><div class="city">'+STORES[idx].city+'</div><div class="prov">'+STORES[idx].prov+'</div><a class="dir" href="'+dirUrl+'" target="_blank" rel="noopener">Directions <svg class="ic"><use href="#i-arrow-ur"></use></svg></a></div><span class="pin"><svg class="ic"><use href="#i-pin"></use></svg></span>';
          d.onclick=function(e){ if(e.target.closest('.dir')) return; e.preventDefault(); applyStore(idx); var mp=document.getElementById('storeMap'); if(mp){ document.querySelector('.map-embed').scrollIntoView({behavior:'smooth',block:'center'}); } var sh=document.getElementById('shop'); if(sh){ sh.scrollIntoView({behavior:'smooth'}); } };
          grid.appendChild(d);
        }
        if(msList){
          var mm=document.createElement('div');
          mm.className='ms';
          mm.innerHTML='<span class="c">'+STORES[idx].city+'</span><span class="p">'+STORES[idx].prov+'</span>';
          mm.onclick=function(){ applyStore(idx); closeModal(); };
          msList.appendChild(mm);
        }
      })(i);
    }
  }

  var modal;
  function openModal(){ if(modal) modal.classList.add('open'); }
  function closeModal(){ if(modal) modal.classList.remove('open'); }

  document.addEventListener('DOMContentLoaded', function(){
    modal=document.getElementById('storeModal');
    buildStoreLists();
    applyStore(active());

    var sb=document.getElementById('storeBtn'); if(sb) sb.onclick=openModal;
    var ps=document.getElementById('panelSwitch'); if(ps) ps.onclick=openModal;
    var mx=document.getElementById('modalX'); if(mx) mx.onclick=closeModal;
    if(modal) modal.onclick=function(e){ if(e.target===modal) closeModal(); };

    // Mobile menu
    var mb=document.getElementById('menuBtn'), mm=document.getElementById('mobileMenu');
    if(mb&&mm){ mb.onclick=function(){ mm.classList.add('open'); };
      var mc=document.getElementById('menuClose'); if(mc) mc.onclick=function(){ mm.classList.remove('open'); };
      var links=mm.querySelectorAll('a'); for(var i=0;i<links.length;i++){ links[i].addEventListener('click',function(){ mm.classList.remove('open'); }); }
    }

    // Nav state: transparent over hero, solid otherwise
    var nav=document.getElementById('nav');
    if(nav){
      var overHero=nav.getAttribute('data-overhero')==='1';
      function onScroll(){ nav.classList.toggle('scrolled', window.scrollY>40); }
      if(overHero){ window.addEventListener('scroll', onScroll); onScroll(); }
      else { nav.classList.add('solid'); }
    }

    // FAQ
    var qs=document.querySelectorAll('.faq-q');
    for(var f=0;f<qs.length;f++){
      qs[f].addEventListener('click', function(){
        var item=this.parentElement;
        var ans=item.querySelector('.faq-a');
        var isOpen=item.classList.contains('open');
        item.classList.toggle('open');
        ans.style.maxHeight=isOpen?null:ans.scrollHeight+'px';
      });
    }

    // Cart (persisted)
    function getCart(){ try{ return parseInt(localStorage.getItem('cf_cart')||'0',10)||0; }catch(e){ return 0; } }
    function setCart(n){ try{ localStorage.setItem('cf_cart',String(n)); }catch(e){} var b=document.querySelectorAll('.icon-btn .badge'); for(var i=0;i<b.length;i++){ b[i].textContent=n; } }
    setCart(getCart());

    // Shop: category chips + live search + URL params
    var chips=document.querySelectorAll('.chip[data-filter]');
    var navSearch=document.querySelector('.nav-search input');
    var onShop=!!document.querySelector('.prodgrid');
    var curCat='all';
    function applyShopFilters(){
      var term=(navSearch&&navSearch.value?navSearch.value:'').trim().toLowerCase();
      var cards=document.querySelectorAll('.prod[data-cat]'), shown=0;
      for(var y=0;y<cards.length;y++){
        var okCat=curCat==='all'||cards[y].getAttribute('data-cat')===curCat;
        var okTerm=!term||cards[y].textContent.toLowerCase().indexOf(term)>-1;
        var show=okCat&&okTerm;
        cards[y].style.display=show?'flex':'none';
        if(show) shown++;
      }
      var none=document.getElementById('noResults'); if(none) none.style.display=shown?'none':'block';
    }
    if(chips.length){
      for(var c=0;c<chips.length;c++){
        chips[c].addEventListener('click', function(){
          curCat=this.getAttribute('data-filter');
          for(var x=0;x<chips.length;x++){ chips[x].classList.toggle('on', chips[x]===this); }
          applyShopFilters();
        });
      }
    }
    if(navSearch){
      if(onShop){ navSearch.addEventListener('input', applyShopFilters); }
      else {
        var sform=navSearch.closest('form');
        if(sform){ sform.addEventListener('submit', function(e){ e.preventDefault(); var q=navSearch.value.trim(); window.location.href='shop.html'+(q?('?q='+encodeURIComponent(q)):''); }); }
      }
    }
    if(onShop){
      try{
        var params=new URLSearchParams(window.location.search);
        var qp=params.get('q'), cp=params.get('cat');
        if(cp){ var chip=document.querySelector('.chip[data-filter="'+cp+'"]'); if(chip&&chips.length){ curCat=cp; for(var z=0;z<chips.length;z++){ chips[z].classList.toggle('on', chips[z]===chip); } } }
        if(qp&&navSearch){ navSearch.value=qp; }
      }catch(e){}
      applyShopFilters();
    }

    // Reveal
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold:.12});
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

    // Quick view
    if(document.querySelector('.prod')){
      var qv=document.createElement('div'); qv.className='modal'; qv.id='qvModal';
      qv.innerHTML='<div class="qv-card"><button class="qv-x" id="qvX" aria-label="Close">&times;</button><div class="qv-img"><img id="qvImg" alt="Product"></div><div class="qv-body"><div class="qv-br" id="qvBr"></div><div class="qv-nm" id="qvNm"></div><div class="qv-pr" id="qvPr"></div><div class="qv-stk" id="qvStk"></div><ul class="qv-feat"><li><svg class="ic"><use href="#i-check"></use></svg> In stock at your local store</li><li><svg class="ic"><use href="#i-check"></use></svg> Fast local delivery from our own warehouse</li><li><svg class="ic"><use href="#i-check"></use></svg> Flexible financing available</li><li><svg class="ic"><use href="#i-check"></use></svg> Backed by our Price Beat Guarantee</li></ul><div class="qv-cta"><a href="#" class="btn" data-demo>Reserve in store <svg class="ic"><use href="#i-arrow"></use></svg></a><a href="#" class="btn btn-ghost qv-add">Add to cart</a></div></div></div>';
      document.body.appendChild(qv);
      var qvClose=function(){ qv.classList.remove('open'); };
      document.getElementById('qvX').onclick=qvClose;
      qv.onclick=function(e){ if(e.target===qv) qvClose(); };
      var qvAdd=qv.querySelector('.qv-add');
      if(qvAdd){ qvAdd.addEventListener('click', function(e){ e.preventDefault(); setCart(getCart()+1); var self=this; self.textContent='Added to cart'; setTimeout(function(){ self.textContent='Add to cart'; }, 1300); }); }
      var prods=document.querySelectorAll('.prod');
      for(var pi=0;pi<prods.length;pi++){
        prods[pi].style.cursor='pointer';
        prods[pi].addEventListener('click', function(){
          var img=this.querySelector('.ph img');
          var g=function(sel){ var el=this.querySelector(sel); return el?el.textContent.trim():''; }.bind(this);
          document.getElementById('qvImg').src=img?img.getAttribute('src'):'';
          document.getElementById('qvBr').textContent=g('.br');
          document.getElementById('qvNm').textContent=g('.nm');
          document.getElementById('qvPr').textContent=g('.pr');
          document.getElementById('qvStk').innerHTML='<span class="dotpulse"></span> In stock in '+(g('.stk')||'your store');
          qv.classList.add('open');
        });
      }
    }

    // Prevent dead-link jumps on demo buttons
    document.querySelectorAll('a[data-demo]').forEach(function(a){
      a.addEventListener('click', function(e){ e.preventDefault(); });
    });
  });
})();
