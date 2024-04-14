use std::io::Cursor;
use id3::Tag;
use serde::{ Deserialize, Serialize };
use wasm_bindgen::prelude::*;
use base64::{ engine::general_purpose::STANDARD as Base64Engine, Engine };

//创建一个结构体来存储封面和歌词
#[derive(Serialize, Deserialize)]
struct Metadata {
    cover: Option<String>, // 假设我们只关心封面数据的Base64编码
    lyrics: Option<String>,
}

#[wasm_bindgen]
pub fn parse_mp3(data: &[u8]) -> String {
    //使用pub fn read_from2（reader： impl Read + Seek） -> Result<Tag>
    //从给定的数据中解析出ID3v2标签
    //并返回一个包含封面和歌词的JSON字符串
    //如果封面或歌词不存在，则返回null
    //转换到vector<u8>类型
    let cursor = Cursor::new(data);
    let tag = Tag::read_from2(cursor).unwrap();
    let cover = tag
        .pictures()
        .next()
        .map(|pic| { Base64Engine.encode(&pic.data) });
    let lyrics = tag
        .lyrics()
        .next()
        .map(|p| p.text.clone());

    let metadata = Metadata {
        cover: cover,
        lyrics: lyrics,
    };

    // 序列化结构体为JSON字符串
    let json_string = serde_json::to_string(&metadata).unwrap();

    // 返回JSON字符串
    json_string
}
