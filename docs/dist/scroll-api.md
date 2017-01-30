# Scroll

## API referece - Table of contents:
* <a href="#scrollApi">scrollApi</a>
* <a href="#scrollApi.move">scrollApi.move</a>
* <a href="#scrollApi.moveTo">scrollApi.moveTo</a>
* <a href="#scrollApi.update">scrollApi.update</a>
* <a href="#scrollApi.getState">scrollApi.getState</a>


#### <a name='scrollApi' href='#scrollApi'>#</a> **scrollApi**()


The scroll api  
#### <a name='scrollApi.move' href='#scrollApi.move'>#</a> **scrollApi.move**(*number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | number | No | No | No |

Move the current scroll  
#### <a name='scrollApi.moveTo' href='#scrollApi.moveTo'>#</a> **scrollApi.moveTo**(*number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | number | No | No | No |

Change the current scroll to a specific value  
#### <a name='scrollApi.update' href='#scrollApi.update'>#</a> **scrollApi.update**(*number [settings.min, ]number [settings.max, ]number [settings.viewSize]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings.min | number | No | Yes | No |
| settings.max | number | No | Yes | No |
| settings.viewSize | number | No | Yes | No |

Update scroll settings  
#### <a name='scrollApi.getState' href='#scrollApi.getState'>#</a> **scrollApi.getState**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | object | with min, max, start &amp; viewSize | ... | ... |

Get the current scroll state  


