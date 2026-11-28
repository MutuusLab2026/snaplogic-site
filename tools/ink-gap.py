import sys
from PIL import Image
import numpy as np
im=np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(int)
H,W,_=im.shape
col=im[:,5,:]   # a column at the far left: only the background
# boundary: first row (below the nav) where the background turns light
b=None
for y in range(120,H):
    if col[y].sum()>600: b=y;break
x0=int(sys.argv[2]) if len(sys.argv)>2 else 100
# hero ink: lowest row above b having a bright text pixel (hero text is white/blue-ish on navy), searching x from x0..W/2
reg=im[:b, x0:W//2, :]
bright=(reg.max(axis=2)>150)
rows=np.where(bright.any(axis=1))[0]; rows=rows[rows>130]
hero_ink=rows.max()
# core ink: first row below b having a dark/blue pixel
reg2=im[b:, x0:W//2, :]
dark=(reg2[:,:,0]<150)
rows2=np.where(dark.any(axis=1))[0]
core_ink=rows2.min()
print('boundary',b,'hero ink bottom->boundary',b-1-hero_ink,'boundary->core ink top',core_ink)
