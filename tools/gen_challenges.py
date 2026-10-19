# Builds data/challenges.json: curated H1 replay scenarios detected from XAUUSD data.
import numpy as np, pandas as pd, json, random
z=np.load('/workspace/research/rr14/data/m1.npz')
df=pd.DataFrame({k:z[k] for k in 'ohlc'},index=pd.DatetimeIndex(z['t'],tz='UTC'))
h=df.resample('1h',label='left',closed='left').agg({'o':'first','h':'max','l':'min','c':'last'}).dropna()
O,H,L,C=[h[k].values for k in 'ohlc'];T=(h.index.view('int64')//10**9);n=len(h)
tr=np.maximum(H-L,np.maximum(abs(H-np.roll(C,1)),abs(L-np.roll(C,1))));atr=pd.Series(tr).rolling(14).mean().values
N=20;cands={k:[] for k in ['bos','choch','sweep','spike','range','chan']}
for i in range(250,n-N-1):
    a=atr[i];hi20=H[i-20:i].max();lo20=L[i-20:i].min();hi50=H[i-50:i].max();lo50=L[i-50:i].min()
    tr100=C[i]-C[i-100]
    if C[i]>hi20 and C[i-1]<=hi20 and tr100>8*a: cands['bos'].append((i,1))
    if C[i]<lo20 and C[i-1]>=lo20 and tr100<-8*a: cands['bos'].append((i,-1))
    if C[i]>hi20 and C[i-1]<=hi20 and tr100<-8*a: cands['choch'].append((i,1))
    if C[i]<lo20 and C[i-1]>=lo20 and tr100>8*a: cands['choch'].append((i,-1))
    if H[i]>hi50 and C[i]<hi50 and H[i]-max(O[i],C[i])>0.5*(H[i]-L[i]): cands['sweep'].append((i,-1))
    if L[i]<lo50 and C[i]>lo50 and min(O[i],C[i])-L[i]>0.5*(H[i]-L[i]): cands['sweep'].append((i,1))
    if H[i]-L[i]>4*atr[i-1]: cands['spike'].append((i,1 if C[i]>O[i] else -1))
    if H[i-80:i+1].max()-L[i-80:i+1].min()<7*a: cands['range'].append((i,0))
    y=C[i-60:i];x=np.arange(60);p=np.polyfit(x,y,1);res=y-np.polyval(p,x);sd=res.std()
    r2=1-res.var()/max(y.var(),1e-9)
    if r2>0.85 and abs(p[0])*60>6*a:
        e=C[i]-np.polyval(p,60)
        if abs(e)>2.2*sd and np.sign(e)!=np.sign(p[0]): cands['chan'].append((i,int(np.sign(e))))
META={
 'bos':('اتجاه قوي وكسر قمة/قاع جديد','كسر هيكل (BOS) في اتجاه الترند الرئيسي'),
 'choch':('كسر معاكس بعد اتجاه طويل','تغير في الشخصية (CHoCH) ضد الاتجاه السابق'),
 'sweep':('ذيل طويل خلف قمة/قاع مهم','سحب سيولة (Liquidity Sweep) فوق/تحت مستوى واضح ثم إغلاق داخل النطاق'),
 'spike':('شمعة عنيفة مفاجئة','شمعة أخبار عنيفة — قد تكون فخاً أو بداية حركة'),
 'range':('سوق عرضي ضيق','نطاق عرضي ضيق — السؤال هو اتجاه الخروج'),
 'chan':('قناة سعرية منتظمة وخروج منها','كسر قناة سعرية منتظمة عكس ميلها'),
}
random.seed(7);out=[]
for cat,lst in cands.items():
    random.shuffle(lst);picked=[];yrs={}
    for i,dr in lst:
        mv=C[i+N]-C[i]
        if abs(mv)<1.5*atr[i]: continue
        if any(abs(T[i]-T[j])<60*86400 for j,_ in picked): continue
        y=h.index[i].year
        if yrs.get(y,0)>=1: continue
        picked.append((i,dr));yrs[y]=1
        if len(picked)>=5: break
    for i,dr in picked:
        a=atr[i];mv=C[i+N]-C[i];up=mv>0;hi=H[i+1:i+N+1].max();lo=L[i+1:i+N+1].min()
        k=abs(mv)/a;diff='سهل' if k>5 else 'متوسط' if k>3 else 'صعب'
        worked=None
        if dr!=0: worked=(np.sign(mv)==dr)
        verdict='' if worked is None else (' — النمط نجح.' if worked else ' — النمط فشل وانعكس السعر (فخ).')
        expl=f"{META[cat][1]}{verdict} ما حدث: {'صعد' if up else 'هبط'} السعر {abs(mv):.1f}$ (≈{k:.1f}×ATR) خلال {N} شمعة ساعة. أعلى سعر {hi:.2f} وأدنى سعر {lo:.2f}."
        META_DE={'bos':'Break of Structure (BOS) in Richtung des Haupttrends','choch':'Change of Character (CHoCH) gegen den vorherigen Trend','sweep':'Liquidity Sweep über/unter einem klaren Level, dann Schluss zurück in der Range','spike':'Heftige News-Kerze — Falle oder Beginn einer Bewegung','range':'Enge Seitwärtsrange — Frage ist die Ausbruchsrichtung','chan':'Bruch eines sauberen Preiskanals gegen seine Neigung'}
        vde='' if worked is None else (' — Muster hat funktioniert.' if worked else ' — Muster ist gescheitert, Preis drehte (Falle).')
        expl_de=f"{META_DE[cat]}{vde} Was passierte: Der Preis {'stieg' if up else 'fiel'} um {abs(mv):.1f}$ (≈{k:.1f}×ATR) in {N} Stundenkerzen. Hoch {hi:.2f}, Tief {lo:.2f}."
        out.append({'expl_de':expl_de,'id':f'{cat}-{h.index[i]:%Y%m%d%H}','cat':cat,'t':int(T[i])+1800,'tf':'H1','title':META[cat][0],'diff':diff,'year':int(h.index[i].year),'expl':expl,'ans':'up' if up else 'down','move':round(float(mv),2)})
out.sort(key=lambda r:r['t'])
json.dump(out,open('/workspace/gold-replay/data/challenges.json','w'),ensure_ascii=False)
print(len(out),{c:sum(1 for r in out if r['cat']==c) for c in META},sorted({r['year'] for r in out}))
